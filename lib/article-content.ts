export const articleContent: Record<
  string,
  { title: string; content: string }
> = {
  welcome: {
    title: "Welcome to the Portal",
    content: `
The Freedom House Portal is your central reference for staff and contractors. Here you can find:

- Help articles and how-to guides
- Quick links to internal tools and resources
- Official documents (handbook, templates, etc.)

## Getting around

Use the header to jump between **Home**, **Portal**, and **Handbook**. The left sidebar shows articles in the current section.
`,
  },
  "access-and-login": {
    title: "Access & Login",
    content: `
Staff and contractors receive access to systems based on their role. This article covers how to get and use credentials.

## Email & Google Workspace

You will receive a Freedom House email address (e.g. \`firstname@freedomhouse.org\`). Use this for all work-related communication. Contact IT or your manager if you have not received login details.

## Other systems

Access to Slack, project tools, and other systems is provisioned by your manager or the operations team.
`,
  },
  "code-of-conduct": {
    title: "Code of Conduct",
    content: `
Freedom House Church expects all staff and contractors to uphold our values and treat one another with respect.

## Expectations

- Act with integrity and honesty
- Respect confidentiality where required
- Communicate professionally in all channels
- Report concerns to a supervisor or HR

The full code of conduct is in the Staff Handbook. Violations may result in corrective action up to and including termination.
`,
  },
  "staff-handbook": {
    title: "Staff Handbook",
    content: `
The full Staff Handbook is available as a PDF. It covers policies, benefits, and expectations in detail.

**[Download Staff Handbook (PDF)](#)** — Replace with the actual PDF link when ready.
`,
  },
};

export function getArticleContent(
  slug: string
): { title: string; content: string } | null {
  const raw = articleContent[slug];
  return raw ? { title: raw.title, content: raw.content } : null;
}
