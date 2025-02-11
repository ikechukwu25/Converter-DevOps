/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCcw, Upload, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LandingPageLayout from "@/components/LandingPageLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";
import X2JS from "x2js";

const XmlToJson = () => {
  const toast = useToast().toast;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [xmlData, setXmlData] = React.useState<string>("");
  const [xmlFile, setXmlFile] = React.useState<File | null>(null);
  const [jsonData, setJsonData] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const convert = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const x2js = new X2JS();
    const xmlDocument = x2js.xml2js(xmlData);
    const res1 = JSON.stringify(xmlDocument, null, 2);
    setTimeout(() => {
      setJsonData(res1);
      setLoading(false );
    }, 2000);
  }


  const clear = () => {
    if (xmlData) setXmlData("");
    if (jsonData) setJsonData("");
    if (error) setError(null);
    if (xmlFile) setXmlFile(null);
  }

  const download = () => {
    if (!jsonData) return;
    setLoading(true);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "json-data.json");
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    setLoading(false);
  };

  const copy = async () => {
    if (!jsonData) return;
    await navigator.clipboard.writeText(jsonData);
    toast({
      title: "Copied to clipboard!",
      className: 'top-0 right-0 flex fixed md:max-w-[320px] md:top-4 md:right-4'
    });
  }

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (jsonData) setJsonData("");
    if (error) setError(null);
    if (xmlFile) setXmlFile(null);
    if (jsonData) setJsonData("");

    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      setError("No file selected");
      return;
    }

    if (file.type !== "text/xml" || !file.name.endsWith(".xml")) {
      setError("Invalid file type! Please upload a .xml file.");
      return;
    }

    setXmlFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent: string | ArrayBuffer | null = reader.result;
      setXmlData(fileContent as string);
    };
    reader.readAsText(file);
    reader.onloadend = () => { }
  };

  return (
    <LandingPageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl text-center">XML to JSON Converter</h1>
        <div className="h-8" />
        <div className="sm:max-w-[600px] mx-auto">
          <form onSubmit={convert} className="space-y-4">
            <Tabs defaultValue="upload" className="sm:max-w-[600px] mx-auto">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="paste">Paste XML</TabsTrigger>
                <TabsTrigger className="w-full" value="upload">Upload XML File</TabsTrigger>
              </TabsList>
              <TabsContent value="paste">
                <div className="pt-4">
                  <div className="space-y-2">
                    {/* <Label htmlFor="xmlData">Paste XML Data</Label> */}
                    <Textarea
                      id="xmlData"
                      value={xmlData} rows={12}
                      onChange={(e) => setXmlData(e.target.value)}
                      className="text-xs"
                      placeholder="Paste your XML data here..."
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="upload" className="pt-4">
                <div className="space-y-2">
                  <Label>Upload XML File</Label>
                  <Input type="file" id="xml-file" accept=".xml" className="hidden" onChange={upload} />
                  <Button type="button" className="p-0 m-0 block w-full bg-slate-200 hover:bg-slate-200/80 border-none outline-none">
                    <Label htmlFor="xml-file" className="flex items-center justify-center cursor-pointer h-10 px-4 rounded-md text-slate-700">
                      <Upload className="mr-2 h-4 w-4" /> Upload file
                    </Label>
                  </Button>
                  <div className="h-4">
                    {xmlFile && <span className="text-xs text-slate-500">{xmlFile.name}</span>}
                    {error && <span className="text-xs text-destructive">{error}</span>}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-2">
              <Button disabled={loading || !xmlData} type="submit">
                {loading ? <><RefreshCcw className="animate-spin" /> Converting</> : <><RefreshCcw /> Convert</>}
              </Button>
              <Button disabled={loading} type="button" onClick={clear} variant="destructive"><X /> Clear</Button>
            </div>
          </form>
        </div>

        {jsonData && (
          <div className="mt-12">
            <div className="flex items-center justify-between gp-8 mb-4">
              <h3 className="font-semibold">JSON Data</h3>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button className="border border-slate-400" variant="outline" disabled={loading || !jsonData} onClick={copy} size="icon" type="button"><Copy /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Copy</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button disabled={loading || !jsonData} onClick={download} size="icon" type="button"><Download /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Download file</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Textarea
              className="border border-slate-400 p-4 text-sm"
              readOnly rows={12}
              value={jsonData}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </LandingPageLayout>
  );
};

export default XmlToJson;
