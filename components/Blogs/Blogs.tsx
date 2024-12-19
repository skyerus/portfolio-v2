import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Title, Paper, Text, Stack, Group } from '@mantine/core';
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

      <Stack gap="md">
        {blogs.map(blog => (
          <Link href={'/blog/' + blog.slug} key={blog.slug} className={classes.link}>
            <Paper p="md" radius="md" className={classes.blogCard}>
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Title order={3} c="gray.0">
                    {blog.meta.title}
                  </Title>
                  <Text c="dimmed">
                    {blog.meta.description}
                  </Text>
                </Stack>
                <Text c="dimmed" size="sm">
                  {blog.meta.date}
                </Text>
              </Group>
            </Paper>
          </Link>
        ))}
      </Stack>
    </Container>
  );
}
