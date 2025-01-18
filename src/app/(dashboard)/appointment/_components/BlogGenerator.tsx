"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DraftList from "./DrafList";
import FileUpload from "./FileUpload";

type Draft = {
  id: string;
  content: string;
};

export default function BlogGenerator() {
  const [prompt, setPrompt] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const handleGenerate = () => {
    // In a real application, you would send the prompt to an API
    // and receive generated content. For this example, we'll just
    // use the prompt as the content.
    const newDraft: Draft = {
      id: Date.now().toString(),
      content: prompt,
    };
    setDrafts([...drafts, newDraft]);
    setPrompt("");
  };

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  };

  const handleEdit = (id: string, newContent: string) => {
    setDrafts(
      drafts.map((draft) =>
        draft.id === id ? { ...draft, content: newContent } : draft
      )
    );
  };

  const handlePublish = (id: string) => {
    // In a real application, you would send the draft to an API
    // to be published. For this example, we'll just log it.
    const draft = drafts.find((d) => d.id === id);
    if (draft) {
      console.log("Publishing draft:", draft);
      // Here you would typically redirect to the published post
      // window.location.href = `/username/${draft.id}`
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="text">
            <TabsList className="mb-4">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Textarea
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mb-4"
              />
            </TabsContent>
            <TabsContent value="file">
              <FileUpload
                onUpload={(file) => console.log("File uploaded:", file)}
              />
            </TabsContent>
          </Tabs>
          <Button onClick={handleGenerate}>Generate</Button>
        </CardContent>
      </Card>

      <DraftList
        drafts={drafts}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onPublish={handlePublish}
      />
    </div>
  );
}
