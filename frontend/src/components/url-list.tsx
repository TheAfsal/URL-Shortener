/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useState } from "react";
import { useUrlStore } from "../store/url-store";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { copyToClipboard } from "../lib/utils";
import { ConfirmationDialog } from "./ConfirmationDialog";

export default function UrlList() {
  const { urls, fetchUrls, isLoading, deleteUrl } = useUrlStore();
  const server_url = import.meta.env.VITE_API_URL || "";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null);

  useEffect(() => {
    fetchUrls().catch(() => {
      toast("Failed to fetch your URLs");
    });
  }, [fetchUrls]);

  const handleCopy = async (shortUrl: string) => {
    try {
      await copyToClipboard(`${server_url}/${shortUrl}`);
      toast("URL copied to clipboard");
    } catch {
      toast("Failed to copy URL");
    }
  };

  const handleDeleteClick = (shortCode: string) => {
    setSelectedShortCode(shortCode);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedShortCode) {
      try {
        await deleteUrl(selectedShortCode);
        toast("URL deleted successfully");
        fetchUrls();
      } catch {
        toast("Failed to delete URL");
      } finally {
        setDialogOpen(false);
        setSelectedShortCode(null);
      }
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedShortCode(null);
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
                  <TableHead className="text-blue-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id} className="border-blue-800/30 hover:bg-blue-900/20">
                    <TableCell className="font-medium text-blue-100">
                      {`${server_url}/${url.shortCode}`}
                    </TableCell>
                    <TableCell className="text-blue-300 truncate max-w-[200px]">
                      {
                        //@ts-ignore
                        url.originalUrl || url.longUrl
                      }
                    </TableCell>
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
                          onClick={() =>
                            window.open(`${server_url}/${url.shortCode}`, "_blank")
                          }
                          className="border-blue-800/50 hover:bg-blue-800/50 text-blue-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(url.shortCode)}
                          className="border-red-800/50 hover:bg-red-800/50 text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete URL"
        description="Are you sure you want to delete this URL? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </Card>
  );
}
