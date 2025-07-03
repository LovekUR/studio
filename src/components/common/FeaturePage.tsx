import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturePageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FeaturePage({ title, description, children }: FeaturePageProps) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <header className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{title}</h1>
        <p className="mt-2 text-lg text-foreground/80">{description}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
