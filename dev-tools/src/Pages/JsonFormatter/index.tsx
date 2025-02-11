import LandingPageLayout from "@/components/LandingPageLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCcw, X } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";

const JsonFormatter = () => {
  const toast = useToast().toast;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [rawData, setRawData] = React.useState<string>("");
  const [formattedData, setFormattedData] = React.useState<string | null>("");
  const [error, setError] = React.useState<string | null>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const format = async () => {
    if (!rawData || rawData.trim() === "") {
      setError("Please enter valid JSON data.");
      return;
    }
    setLoading(true);
    if (error) setError(null);

    try {
      const parsedData = JSON.parse(rawData);
      if (typeof parsedData !== "object" || parsedData === null) {
        setError("Invalid JSON data! Please check your data and try again.");
        setLoading(false);
        return;
      }
      const formatted = JSON.stringify(parsedData, null, 2);
      setTimeout(() => {
        setFormattedData(formatted);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log({ error });
      setError(error instanceof Error ? error.message : "Unable to format JSON data.");
      setLoading(false);
    }
  };

  const clear = () => {
    if (rawData) setRawData("");
    if (formattedData) setFormattedData(null);
    if (error) setError(null);
  }

  const download = () => {
    if (!formattedData || formattedData.trim() === "") return;
    setLoading(true);
    const blob = new Blob([formattedData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "json-data.json");
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    setLoading(false);
  }

  const copy = async () => {
    if(formattedData) {
      await navigator.clipboard.writeText(formattedData);
      toast({
        title: "Copied to clipboard!",
        className: 'top-0 right-0 flex fixed md:max-w-[320px] md:top-4 md:right-4'
      });
    }
  }

  return (
    <LandingPageLayout>
      <div className="px-4 py-8 container">
        <h1 className="text-center text-xl">JSON Formatter</h1>
        <div className="h-8" />
        <div className="space-y-12">
          <form className="space-y-4">
            <div className="">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Enter data to format</Label>
                <Textarea
                  className="border border-slate-400 resize-none text-sm"
                  placeholder="Paste JSON data here"
                  rows={12}
                  disabled={loading}
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                />
                <div className="h-6">
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Button disabled={loading || !rawData || rawData.trim() === ""} onClick={format} className="sm:w-[120px]" type="button">
                  {loading ? <RefreshCcw className="animate-spin" /> : <><RefreshCcw /> Convert</>}
                </Button>
                <Button disabled={loading} onClick={clear} className="sm:w-[120px]" type="button" variant='destructive'><X /> Clear</Button>
              </div>
            </div>
          </form>
          <div>
            {
              formattedData && (
                <div>
                  <div className="flex gap gap-8 items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Formatted JSON Data</h3>
                    </div>
                    <div className="space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button disabled={loading || !formattedData} onClick={copy} className="border-slate-300" variant="outline" size="icon" type="button"><Copy /></Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button disabled={loading || !formattedData} onClick={download} size="icon" type="button"><Download /></Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download file</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="h-4" />
                  <div>
                    <Textarea
                      className="border border-slate-400 resize-none text-sm"
                      rows={15} readOnly
                      value={formattedData}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </LandingPageLayout>
  )
}

export default JsonFormatter;
