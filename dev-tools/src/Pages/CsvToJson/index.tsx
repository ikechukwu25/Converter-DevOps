import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCcw, Upload, X } from "lucide-react";
import LandingPageLayout from "@/components/LandingPageLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";

const CsvToJson = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toast = useToast().toast;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [csvData, setCsvData] = React.useState<string>("");
  const [jsonData, setJsonData] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [delimiter, setDelimiter] = React.useState<string>(",");
  const [csvFile, setCsvFile] = React.useState<File | null>(null);

  const convert = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rows = csvData.split("\n").map((row) => row.trim()).filter((row) => row !== "");
      const regex = new RegExp(`(?:[^"${delimiter}"]|"(?:[^"]|"")*")+`, "g");
      const headers = rows[0].match(regex)?.map((header) => header.replace(/"/g, ""));
      if (!headers) {
        setError("Invalid CSV format! Please check your data.");
        setLoading(false);
        return;
      }

      if (error) setError(null);
      const json = rows.slice(1).map((row) => {
        const values = row.match(regex)?.map((value) => value.replace(/"/g, ""));
        const obj: Record<string, string> = {};
        if (values) {
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
        }
        return obj;
      });
      // Format JSON with indentation
      setTimeout(() => {
        setJsonData(JSON.stringify(json, null, 2));
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.log({ err });
      setError("Invalid CSV format! Please check your data.");
      setLoading(false);
    }
  };

  const clear = () => {
    if (csvData) setCsvData("");
    if (jsonData) setJsonData("");
    if (error) setError(null);
    if (csvFile) setCsvFile(null);
  }

  const onDelimiterChange = (e: React.ChangeEvent<HTMLInputElement>) => setDelimiter(e.target.value);

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
    if (csvFile) setCsvFile(null);
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      setError("No file selected");
      return;
    }
    if (file.type !== "text/csv" || !file.name.endsWith(".csv")) {
      setError("Invalid file type! Please upload a CSV file.");
      return;
    }

    setCsvFile(file);
    if (jsonData) setJsonData("");
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;
      setCsvData(fileContent);
    };
    reader.readAsText(file);
    reader.onloadend = () => { }
  };

  return (
    <LandingPageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl text-center">CSV to JSON Converter</h1>
        <div className="h-8" />
        <div className="sm:max-w-[600px] mx-auto">
          <form onSubmit={convert} className="space-y-4">
            <div className="space-y-2">
              <Label>Upload CSV File</Label>
              <Input type="file" id="csvFile" accept=".csv" className="hidden" onChange={upload} />
              <Button type="button" className="p-0 m-0 block w-full bg-slate-200 hover:bg-slate-200/80 border-none outline-none">
                <Label htmlFor="csvFile" className="flex items-center justify-center cursor-pointer h-10 px-4 rounded-md text-slate-700">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Label>
              </Button>
              {csvFile && <span className="text-xs text-slate-500">{csvFile.name}</span>}
              {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            <div className="space-y-1">
              <Label>Delimiter</Label>
              <Input type="text" value={delimiter} onChange={onDelimiterChange} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={loading || !csvFile} type="submit">
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

export default CsvToJson;
