import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Title, Paper, Text, Image, Group } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { App } from '@/components/App/App';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import '@/styles/highlight-js/github-dark.css';
import classes from './page.module.css';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { ReactNode } from 'react';

function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function getPost(slug: string) {
  const markdownFile = fs.readFileSync(path.join('blogs', `${slug}.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  if (frontMatter.headerImage && !frontMatter.headerImage.startsWith('/')) {
    frontMatter.headerImage = `/${frontMatter.headerImage}`;
  }

  const readingTime = getReadingTime(content);

  return {
    frontMatter,
    slug,
    content,
    readingTime
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join('blogs'));

  const paths = files.map(filename => ({
    slug: filename.replace('.mdx', '')
  }));

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const blog = getPost(slug);

  return {
    title: blog.frontMatter.title,
    description: blog.frontMatter.description,
  };
}

const components = {
  h1: (props: any) => (
    <Title order={1} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  h2: (props: any) => (
    <Title order={2} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  h3: (props: any) => (
    <Title order={3} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  h4: (props: any) => (
    <Title order={4} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  h5: (props: any) => (
    <Title order={5} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  h6: (props: any) => (
    <Title order={6} pt="xl" pb="md" {...props} c="gray.0" />
  ),
  p: (props: any) => <Text size="lg" {...props} c="gray.0" />,
  pre: ({ children, className }: { children?: ReactNode; className?: string }) => {
    return <CodeBlock>{children}</CodeBlock>;
  },
  img: (props: any) => {
    const src = props.src.startsWith('/') ? props.src : `/${props.src}`;
    return (
      <Image
        {...props}
        src={src}
        radius="md"
        style={{ 
          margin: '2rem 0',
          display: 'inline-block',
          maxWidth: '100%'
        }}
      />
    );
  },
};

const options = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight],
  }
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const props = getPost(slug);

  return (
    <App>
      <Container size="md" py="xl">
        <Paper className={classes.container} p={{base: 0, xs: "xl"}}>
          {props.frontMatter.headerImage && (
            <Image
              src={props.frontMatter.headerImage}
              alt={props.frontMatter.title}
              className={classes.headerImage}
              radius="md"
            />
          )}
          <Title c="gray.0" mb="xs" size={40} ta="center">
            {props.frontMatter.title}
          </Title>
          <Group justify="center" gap="xs" mb="xl" mt="xs">
            <Text c="dimmed">
              {props.frontMatter.date}
            </Text>
            <Text c="dimmed">•</Text>
            <Group gap={4}>
              <IconBook size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text c="dimmed">
                {props.readingTime}
              </Text>
            </Group>
          </Group>
          <Container p={0} w={{ base: "100%", md: "80%" }}>
            <div className={classes['mdx-content']}>
              <MDXRemote source={props.content} components={components} options={options} />
            </div>
          </Container>
        </Paper>
      </Container>
    </App>
  );
}
