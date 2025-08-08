import React from 'react';

export default function TaskComments({ comments }: { comments: { id: string; content: string }[] }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white border rounded p-3">
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div>
      ))}
    </div>
  );
}


