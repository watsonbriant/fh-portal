import { supabase } from './supabase'

export type NavSection = string;

export interface Article {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  section: NavSection;
  category_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  title: string;
  section: NavSection;
  sort_order: number;
  created_at: string;
  updated_at: string;
  articles?: Article[];
}

export interface NavigationItem {
  id: string;
  href: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Fetch all categories with their articles
export async function getAllCategories(): Promise<Category[]> {
  const { data: categories, error: categoriesError } = await supabase
    .from('z_p_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return [];
  }

  const { data: articles, error: articlesError } = await supabase
    .from('z_p_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (articlesError) {
    console.error('Error fetching articles:', articlesError);
    return categories || [];
  }

  // Group articles by category
  return (categories || []).map(category => ({
    ...category,
    articles: (articles || []).filter(a => a.category_id === category.id)
  }));
}

// Fetch categories for a specific section
export async function getCategoriesForSection(section: NavSection): Promise<Category[]> {
  const allCategories = await getAllCategories();
  return allCategories.filter(c => c.section === section);
}

// Fetch a single article by section and slug
export async function getArticle(section: NavSection, slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('z_p_articles')
    .select('*')
    .eq('section', section)
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

// Fetch distinct sections from categories (for routing validation)
export async function getSections(): Promise<string[]> {
  const categories = await getAllCategories();
  const sections = [...new Set(categories.map((c) => c.section))];
  return sections;
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