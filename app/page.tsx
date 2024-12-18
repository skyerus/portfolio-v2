import { Home } from '@/components/Home/Home';
import { App } from '@/components/App/App';
import { Chat } from '@/components/Chat/Chat';
import { Projects } from '@/components/Projects/Projects';
import { Skills } from '@/components/Skills/Skills';

export default function HomePage() {
  return (
    <>
      <App>
        <Home/>
        <Skills/>
        <Projects/>
        {/* <Chat/> */}
      </App>
    </>
  );
}
