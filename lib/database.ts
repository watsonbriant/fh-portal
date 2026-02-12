import { supabase } from './supabase'

export type NavSection = string;

export interface Article {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  section_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  title: string;
  category_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  articles?: Article[];
}

export interface Category {
  id: string;
  title: string;
  section: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  sections?: Section[];
}

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Fetch all categories with their sections and articles
export async function getAllCategories(): Promise<Category[]> {
  const { data: categories, error: categoriesError } = await supabase
    .from('z_p_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return [];
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('z_p_sections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (sectionsError) {
    console.error('Error fetching sections:', sectionsError);
    return categories || [];
  }

  const { data: articles, error: articlesError } = await supabase
    .from('z_p_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (articlesError) {
    console.error('Error fetching articles:', articlesError);
  }

  // Build the hierarchy: Categories -> Sections -> Articles
  return (categories || []).map(category => ({
    ...category,
    sections: (sections || [])
      .filter(s => s.category_id === category.id)
      .map(section => ({
        ...section,
        articles: (articles || []).filter(a => a.section_id === section.id)
      }))
  }));
}

// Fetch categories for a specific section (category section, not our new sections table)
export async function getCategoriesForSection(categorySection: string): Promise<Category[]> {
  const allCategories = await getAllCategories();
  return allCategories.filter(c => c.section === categorySection);
}

// Get all unique category sections (for routing)
export async function getSections(): Promise<string[]> {
  const { data, error } = await supabase
    .from('z_p_categories')
    .select('section');

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return [...new Set((data || []).map(c => c.section))];
}

// Fetch a single article by category section, section id, and slug
export async function getArticle(
  categorySection: string,
  sectionId: string,
  slug: string
): Promise<Article | null> {
  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from('z_p_categories')
    .select('id')
    .eq('section', categorySection)
    .single();

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError);
    return null;
  }

  // Then verify the section belongs to this category
  const { data: section, error: sectionError } = await supabase
    .from('z_p_sections')
    .select('id')
    .eq('id', sectionId)
    .eq('category_id', category.id)
    .single();

  if (sectionError || !section) {
    console.error('Error fetching section:', sectionError);
    return null;
  }

  // Finally get the article
  const { data, error } = await supabase
    .from('z_p_articles')
    .select('*')
    .eq('section_id', section.id)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

// Fetch all articles
export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('z_p_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data || [];
}

// Fetch navigation items
export async function getNavigationItems(): Promise<NavigationItem[]> {
  const { data, error } = await supabase
    .from('z_p_navigation_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching navigation items:', error);
    return [];
  }

  return data || [];
}

// Helper to get full article path (category/section/slug)
export async function getArticlePath(articleId: string): Promise<string | null> {
  const { data: article, error: articleError } = await supabase
    .from('z_p_articles')
    .select('slug, section_id')
    .eq('id', articleId)
    .single();

  if (articleError || !article) return null;

  const { data: section, error: sectionError } = await supabase
    .from('z_p_sections')
    .select('id, category_id')
    .eq('id', article.section_id)
    .single();

  if (sectionError || !section) return null;

  const { data: category, error: categoryError } = await supabase
    .from('z_p_categories')
    .select('section')
    .eq('id', section.category_id)
    .single();

  if (categoryError || !category) return null;

  return `/${category.section}/${section.id}/${article.slug}`;
}

// Get section by ID with its category info
export async function getSectionWithCategory(sectionId: string) {
  const { data: section, error: sectionError } = await supabase
    .from('z_p_sections')
    .select('*, category:z_p_categories(*)')
    .eq('id', sectionId)
    .single();

  if (sectionError) {
    console.error('Error fetching section:', sectionError);
    return null;
  }

  return section;
}

export interface ArticleNavLink {
  href: string;
  title: string;
  sectionTitle: string;
}

// Get previous and next article in global order: category sort_order, section sort_order, article sort_order
export async function getArticlePrevNext(
  categorySection: string,
  sectionId: string,
  slug: string
): Promise<{ prev: ArticleNavLink | null; next: ArticleNavLink | null }> {
  const categories = await getAllCategories();
  const flat: ArticleNavLink[] = [];
  for (const category of categories) {
    for (const sec of category.sections || []) {
      for (const article of sec.articles || []) {
        flat.push({
          href: `/${category.section}/${sec.id}/${article.slug}`,
          title: article.title,
          sectionTitle: sec.title,
        });
      }
    }
  }
  const currentHref = `/${categorySection}/${sectionId}/${slug}`;
  const idx = flat.findIndex((item) => item.href === currentHref);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}