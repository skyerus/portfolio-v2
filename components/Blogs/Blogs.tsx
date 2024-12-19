import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Title, Paper, Text, Stack, Image, SimpleGrid } from '@mantine/core';
import Link from 'next/link';
import classes from './Blogs.module.css';

export function Blogs() {
  // Set blogs directory
  const blogDir = "blogs";

  // Find all files in the blog directory
  const files = fs.readdirSync(path.join(blogDir));

  // For each blog found
  const blogs = files.map(filename => {
    // Read the content of that blog
    const fileContent = fs.readFileSync(path.join(blogDir, filename), 'utf-8');

    // Extract the metadata from the blog's content
    const { data: frontMatter } = matter(fileContent);

    // Ensure headerImage starts with a forward slash
    if (frontMatter.headerImage && !frontMatter.headerImage.startsWith('/')) {
      frontMatter.headerImage = `/${frontMatter.headerImage}`;
    }

    // Return the metadata and page slug
    return {
      meta: frontMatter,
      slug: filename.replace('.mdx', '')
    };
  });

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl" c="gray.0">
        Latest Blogs
      </Title>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
        {blogs.map(blog => (
          <Link href={'/blog/' + blog.slug} key={blog.slug} className={classes.link}>
            <Paper p={0} radius="md" className={classes.blogCard}>
              {blog.meta.headerImage && (
                <Image
                  src={blog.meta.headerImage}
                  alt={blog.meta.title}
                  height={200}
                  radius="md"
                />
              )}
              <Stack gap="xs" p="md">
                <Title order={3} c="gray.0">
                  {blog.meta.title}
                </Title>
                <Text c="dimmed">
                  {blog.meta.description}
                </Text>
                <Text c="dimmed" size="sm">
                  {blog.meta.date}
                </Text>
              </Stack>
            </Paper>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}
