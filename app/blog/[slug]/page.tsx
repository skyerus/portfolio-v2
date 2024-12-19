import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Title, Paper, Text } from '@mantine/core';
import { App } from '@/components/App/App';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import '@/styles/highlight-js/github-dark.css';
import classes from './page.module.css';

function getPost(slug: string) {
  const markdownFile = fs.readFileSync(path.join('blogs', slug + '.mdx'), 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    frontMatter,
    slug,
    content
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
  h1: (props: any) => <Title pt="md" pb="md" order={1} {...props} c="gray.0" />,
  h2: (props: any) => <Title pt="md" pb="md" order={2} {...props} c="gray.0" />,
  h3: (props: any) => <Title pt="md" pb="md" order={3} {...props} c="gray.0" />,
  p: (props: any) => <Text {...props} c="gray.0" />,
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
        <Paper p="xl" radius="lg" bg="inherit">
          <Title order={1} mb="xl" c="gray.0">
            {props.frontMatter.title}
          </Title>
          
          <div className="mdx-content">
            {/* @ts-expect-error Server Component */}
            <MDXRemote source={props.content} components={components} options={options} />
          </div>
        </Paper>
      </Container>
    </App>
  );
}
