import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Layers, BrainCircuit, Image as ImageIcon, Mic, ClipboardList } from 'lucide-react';

const features = [
  {
    title: 'Hyper-Local Content',
    description: 'Request stories, explanations, or worksheets in local languages.',
    icon: <Globe className="w-12 h-12 text-primary" />,
    href: '/hyper-local-content',
    color: 'hover:border-pink-400',
  },
  {
    title: 'Differentiated Materials',
    description: 'Generate worksheets for multiple grade levels from textbook photos.',
    icon: <Layers className="w-12 h-12 text-primary" />,
    href: '/differentiated-materials',
    color: 'hover:border-violet-400',
  },
  {
    title: 'Instant Knowledge Base',
    description: 'Get instant answers to questions with simple analogies.',
    icon: <BrainCircuit className="w-12 h-12 text-primary" />,
    href: '/knowledge-base',
    color: 'hover:border-yellow-400',
  },
  {
    title: 'Visual Aid Generator',
    description: 'Create simple line drawings and charts from text prompts.',
    icon: <ImageIcon className="w-12 h-12 text-primary" />,
    href: '/visual-aid',
    color: 'hover:border-green-400',
  },
  {
    title: 'Audio Reading Assessment',
    description: 'Assess student reading by analyzing recorded speech.',
    icon: <Mic className="w-12 h-12 text-primary" />,
    href: '/reading-assessment',
    color: 'hover:border-blue-400',
  },
  {
    title: 'Game & Lesson Planner',
    description: 'Generate educational games and detailed lesson plans.',
    icon: <ClipboardList className="w-12 h-12 text-primary" />,
    href: '/lesson-planner',
    color: 'hover:border-red-400',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">Sahayak AI</h1>
        <p className="mt-4 text-lg md:text-xl text-primary/80">Empowering Teachers in Multi-Grade Classrooms</p>
      </header>

      <main className="w-full max-w-6xl">
        <section className="text-center mb-16">
          <p className="text-xl max-w-3xl mx-auto text-foreground/90">
            Sahayak AI is your smart assistant, designed to simplify the complexities of teaching diverse age groups.
            Leverage the power of AI to create customized materials, get instant support, and make learning more engaging for every student.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.title} passHref>
                <Card className={`bg-card/80 backdrop-blur-sm border-2 border-transparent transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 ${feature.color}`}>
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4 text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-foreground/80">
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="text-center mt-16">
        <p className="text-sm text-foreground/60">Built with ❤️ for teachers everywhere.</p>
      </footer>
    </div>
  );
}
