import LandingPageLayout from "@/components/LandingPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, X } from "lucide-react";
import React from "react";

const InterfaceGenerator = () => {
  const toast = useToast().toast;
  const generateTsInterface = (json_input: Record<string, string | number | boolean | Array<unknown>>): string => {
    const getType = (val: unknown): string => {
      if (val === null) return 'null';
      if (Array.isArray(val)) {
        const types = new Set(val.map(item => getType(item)));
        return types.size === 1 ? [...types].join(' | ') : `Array<${[...types].join(' | ')}>`;
      }
      if (typeof val === 'object') {
        return generateTsInterface(val as Record<string, string | number | boolean | Array<unknown>>);
      }
      return typeof val;
    }

    const entries = Object.entries(json_input).map(([key, value]) => `${key}: ${getType(value)}`).join('\n');
    return `{\n ${entries} \n}`;
  }

  const [loading, setLoading] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<string>("");
  const [result, setResult] = React.useState<string | null>(null);
  const [interfaceName, setInterfaceName] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const generateInterface = (e: React.FormEvent) => {
    if(error) setError(null);
    e.preventDefault();
    try {
      if (!input) {
        setError("Input cannot be empty");
        return;
      }

      setLoading(true);
      const parsedData = JSON.parse(input);

      if (typeof parsedData !== "object" || parsedData === null) {
        setError("Invalid JSON data! Please check your data and try again.");
        setLoading(false);
        return;
      }

      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      const interface_name = interfaceName.split(" ").map(item => capitalize(item)).join("");

      if (Array.isArray(parsedData)) {
        const interface_result = `interface ${interface_name} ` + generateTsInterface(parsedData[0]);
        setTimeout(() => {
          setResult(interface_result);
          setLoading(false);
        }, 2000);
        return;
      }

      let interface_result = generateTsInterface(parsedData);
      interface_result = `interface ${interface_name} ` + interface_result;
      setTimeout(() => {
        setResult(interface_result);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log({ error });
      setError(error instanceof Error ? error.message : "Unable to convert data at this time.");
      setLoading(false);
    }
  }

  const clear = () => {
    if (input) setInput("");
    if (result) setResult(null);
    if (error) setError(null);
    if (interfaceName) setInterfaceName("");
  }

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard!",
      className: 'top-0 right-0 flex fixed md:max-w-[320px] md:top-4 md:right-4'
    });
  }

  return (
    <LandingPageLayout>
      <div className="container px-4 py-8">
        <h1 className="text-center text-xl">Generate TypeScript interface from JSON</h1>
        <div className="h-8" />
        <div className="">
          <div className="flex flex-col sm:flex-row w-full gap-12 sm:gap-4">
            <form className="space-y-2 w-full" onSubmit={generateInterface}>
              <div className="space-y-2">
                <div className="flex gap-1 items-center mt-[1.625rem]">
                  {/* <Button className="hidden sm:inline-flex" size="icon"><FileJson /></Button> */}
                  <Label className="font-semibold text-slate-700">Enter JSON data</Label>
                </div>
                <Textarea
                  rows={12} disabled={loading}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-sm border-slate-400 rounded-md resize-none"
                />
                <div className="h-8">
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-slate-500">Interface name</Label>
                <Input
                  value={interfaceName} required disabled={loading}
                  onChange={(e) => setInterfaceName(e.target.value)}
                  className="text-sm border-slate-400"
                />
              </div>
              <div className="grid gap-2 grid-cols-2 pt-4 sm:flex">
                <Button className="sm:w-[140px]" disabled={loading || !input || !interfaceName}>
                  {loading ? <><RotateCcw className="animate-spin" /> Generating</> : <><RotateCcw /> Generate</>}
                </Button>
                <Button className="sm:w-[140px]" disabled={loading} type="button" onClick={clear} variant="destructive"><X /> Clear</Button>
              </div>
            </form>

            <div className="space-y-2 w-full">
              <div className="flex gap-8 items-end justify-between">
                <Label className="block text-sm font-medium text-slate-700">TS Interface</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button className="border border-slate-400" variant="outline" disabled={loading || !result} onClick={copy} size="icon" type="button"><Copy /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Copy text</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                rows={12}
                value={result ?? ""}
                readOnly
                className="text-sm border-slate-400 rounded-md resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  )
}

export default InterfaceGenerator;
