"use client";

import { useEffect } from "react";
import { useUrlStore } from "../store/url-store";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { copyToClipboard } from "../lib/utils";

export default function UrlList() {
 const { urls, fetchUrls, isLoading } = useUrlStore();

 useEffect(() => {
  fetchUrls().catch(() => {
   toast("Failed to fetch your URLs");
  });
 }, [fetchUrls, toast]);

 const handleCopy = async (shortUrl: string) => {
  try {
   await copyToClipboard(`${window.location.origin}/api/url/${shortUrl}`);
   toast("URL copied to clipboard");
  } catch (error) {
   toast("Failed to copy URL");
  }
 };

 return (
  <Card className="gradient-card mt-8">
   <CardHeader>
    <CardTitle className="text-blue-100">Your Shortened URLs</CardTitle>
    <CardDescription className="text-blue-300">
     Manage all your shortened links in one place
    </CardDescription>
   </CardHeader>
   <CardContent>
    {isLoading ? (
     <div className="text-center py-8 text-blue-300">Loading...</div>
    ) : urls.length === 0 ? (
     <div className="text-center py-8 text-blue-300">
      You haven't created any shortened URLs yet
     </div>
    ) : (
     <div className="overflow-x-auto">
      <Table>
       <TableHeader>
        <TableRow className="border-blue-800/30 hover:bg-blue-900/20">
         <TableHead className="text-blue-200">Short URL</TableHead>
         <TableHead className="text-blue-200">Original URL</TableHead>
         {/*<TableHead className="text-blue-200">Created</TableHead>*/}
         <TableHead className="text-blue-200">Actions</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {urls.map((url) => (
         <TableRow key={url.id} className="border-blue-800/30 hover:bg-blue-900/20">
          <TableCell className="font-medium text-blue-100">{url.shortCode}</TableCell>
          <TableCell className="text-blue-300 truncate max-w-[200px]">{url.longUrl}</TableCell>
          {/*<TableCell className="text-blue-300">{formatDate(url.createdAt)}</TableCell>*/}
          <TableCell>
           <div className="flex gap-2">
            <Button
             variant="outline"
             size="sm"
             onClick={() => handleCopy(url.shortCode)}
             className="border-blue-800/50 hover:bg-blue-800/50 text-blue-300"
            >
             <Copy className="h-4 w-4" />
             <span className="sr-only">Copy</span>
            </Button>
            <Button
             variant="outline"
             size="sm"
             onClick={() => window.open(`/api/url/${url.shortCode}`, "_blank")}
             className="border-blue-800/50 hover:bg-blue-800/50 text-blue-300"
            >
             <ExternalLink className="h-4 w-4" />
             <span className="sr-only">Open</span>
            </Button>
           </div>
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     </div>
    )}
   </CardContent>
  </Card>
 );
}
