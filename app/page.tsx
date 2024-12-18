import { Home } from '@/components/Home/Home';
import { App } from '@/components/App/App';
import { Projects } from '@/components/Projects/Projects';
import { Contact } from '@/components/Contact/Contact';
import { Section } from '@/components/Section';

export default function HomePage() {
  return (
    <>
      <App>
        <Section id="home">
          <Home/>
        </Section>
        <Section id="projects">
          <Projects/>
        </Section>
        <Section id="contact">
          <Contact/>
        </Section>
      </App>
    </>
  );
}
