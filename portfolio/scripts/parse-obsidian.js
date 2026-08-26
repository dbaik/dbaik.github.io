import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CASES_DIR = path.join(process.cwd(), 'content', 'cases');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'cases.json');

// Ensure output directory exists
const publicDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const REQUIRED_FIELDS = [
  'title',
  'business_type',
  'category',
  'video_type',
  'platforms',
  'duration',
  'style',
  'tags',
  'ratio',
  'cover_image',
  'prompt_concept'
];

function parseCases() {
  console.log('🚀 Starting content pipeline: parsing Obsidian markdown files...');

  if (!fs.existsSync(CASES_DIR)) {
    console.error(`❌ Cases directory does not exist: ${CASES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CASES_DIR).filter(file => file.endsWith('.md'));
  const cases = [];

  for (const file of files) {
    const filePath = path.join(CASES_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter and content
    const parsed = matter(fileContent);
    const { data, content } = parsed;
    const slug = path.basename(file, '.md');

    // Validate fields
    const missingFields = REQUIRED_FIELDS.filter(field => data[field] === undefined);
    if (missingFields.length > 0) {
      console.warn(`⚠️ Warning in "${file}": Missing required fields: ${missingFields.join(', ')}`);
    }

    // Parse sections from body (split by markdown headings)
    const sections = {};
    const bodyLines = content.split('\n');
    let currentHeading = 'introduction';
    let currentText = [];

    for (const line of bodyLines) {
      if (line.startsWith('# ')) {
        // Save previous section
        if (currentText.length > 0) {
          sections[currentHeading] = currentText.join('\n').trim();
        }
        currentHeading = line.substring(2).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
        currentText = [];
      } else {
        currentText.push(line);
      }
    }
    if (currentText.length > 0) {
      sections[currentHeading] = currentText.join('\n').trim();
    }

    cases.push({
      slug,
      ...data,
      body: content.trim(),
      sections
    });
  }

  // Sort by featured (true first), then weight (ascending)
  cases.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return (a.weight || 100) - (b.weight || 100);
  });

  // Write to public/cases.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cases, null, 2), 'utf-8');
  console.log(`✅ Success! Generated ${cases.length} cases in ${OUTPUT_FILE}`);
}

parseCases();
