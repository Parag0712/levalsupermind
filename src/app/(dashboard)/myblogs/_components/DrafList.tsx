"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Draft = {
  id: string;
  content: string;
};

type DraftListProps = {
  drafts: Draft[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
  onPublish: (id: string) => void;
};

export default function DraftList({
  drafts,
  onDelete,
  onEdit,
  onPublish,
}: DraftListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEditStart = (draft: Draft) => {
    setEditingId(draft.id);
    setEditContent(draft.content);
  };

  const handleEditSave = () => {
    if (editingId) {
      onEdit(editingId, editContent);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Drafts</h2>
      {drafts.map((draft) => (
        <Card key={draft.id}>
          <CardContent className="pt-6">
            {editingId === draft.id ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mb-4"
              />
            ) : (
              <p>{draft.content}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {editingId === draft.id ? (
              <Button onClick={handleEditSave}>Save</Button>
            ) : (
              <Button onClick={() => handleEditStart(draft)}>Edit</Button>
            )}
            <Button variant="outline" onClick={() => onDelete(draft.id)}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => onPublish(draft.id)}>
              Publish
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
