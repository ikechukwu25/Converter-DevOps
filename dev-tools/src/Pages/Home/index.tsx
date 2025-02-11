import LandingPageLayout from "@/components/LandingPageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Braces, Code, FileCode2, FileJson, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const apps = [
    {
      title: "CSV to JSON",
      description: "Convert CSV files to JSON format with support for custom delimiters and nested structures.",
      icon: FileText,
      link: "/csv-to-json"
    },
    {
      title: "JSON to CSV",
      description: "Transform JSON data into CSV format with automatic column detection and field mapping.",
      icon: FileJson,
      link: "/json-to-csv"
    },
    {
      title: "JSON Formatter",
      description: "Format and validate JSON with customizable indentation and sorting options.",
      icon: Code,
      link: "/json-formatter"
    },
    {
      title: "TS Interface Generator",
      description: "Generate TypeScript interfaces from JSON data with smart type inference.",
      icon: Braces,
      link: "/json-to-interface"
    },
    {
      title: "XML to JSON Converter",
      description: "Convert XML files and strings to JSON.",
      icon: FileCode2,
      link: "/xml-to-json"
    },
    {
      title: "Shadcn Theme Generator",
      description: "Generate css files for shadcn ui component library.",
      icon: Settings,
      link: "/shadcn-theme-generator"
    }
  ];

  return (
    <LandingPageLayout>
      <section>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-slate-700 sm:text-5xl md:text-6xl">
              Transform Your Data <span className="text-primary italic">Instantly</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Lightning-fast, developer-friendly, and completely free. Your all-in-one solution for data conversion, formatting, and TypeScript interface generation.
            </p>
            <div className="mt-10">
              <a href="#start">
                <Button className="inline-flex items-center bg-slate-700">
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </section>

      <section className="py-20 bg-indigo-300/10" id="start">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Powerful Tools at Your Fingertips</h3>
          <p className="text-md text-center leading-8 text-gray-600">Powerful tools in one place to handle all your data conversion needs</p>
          <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map(item => (
              <Link key={item.description} to={item.link} className="shadow shadow-slate-200 border border-slate-500/10 rounded hover:bg-indigo-300/10">
                <div className="feature-card-gradient rounded-2xl p-8 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-500/10">
                    <item.icon className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="mt-6 text-xl text-slate-700 font-semibold">{item.title}</h3>
                  <p className="mt-4 text-slate-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Supercharge Your Data Workflow?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who trust DataMorphosis for their data transformation needs.<br />
            It's fast, it's simple, it's developer-friendly, and best of all, it's free!
          </p>
          <a href="#start">
            <Button size="lg" className="inline-flex items-center bg-slate-700">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>
    </LandingPageLayout>
  )
}

export default Home;

