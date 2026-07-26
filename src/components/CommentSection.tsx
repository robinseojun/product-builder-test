import React, { useState, useEffect } from 'react';
import { User, Send, MessageSquare, Clock, ThumbsUp, MoreVertical } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  upvotes: number;
}

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem('lotto_comments');
      return stored ? JSON.parse(stored) : [
        {
          id: '1',
          author: '행운의사나이',
          text: '이번 주 1등은 접니다! 다들 좋은 기운 받아가세요.',
          createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          upvotes: 12
        },
        {
          id: '2',
          author: '로또명당',
          text: '자동 생성기 너무 깔끔하고 좋네요. 꿈해몽 기능 신기합니다.',
          createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
          upvotes: 5
        }
      ];
    } catch {
      return [];
    }
  });
  
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    localStorage.setItem('lotto_comments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString() + Math.random().toString(),
      author: authorName.trim() || '익명',
      text: newComment.trim(),
      createdAt: Date.now(),
      upvotes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleUpvote = (id: string) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c
    ));
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg mt-8">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <MessageSquare className="w-5 h-5 text-amber-500" />
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
          댓글 <span className="text-amber-500 ml-1">{comments.length}</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 space-y-3">
            <input
              type="text"
              placeholder="이름 (선택)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 dark:text-slate-100"
            />
            <div className="relative">
              <textarea
                placeholder="댓글을 남겨보세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute bottom-3 right-3 p-2 bg-slate-900 dark:bg-amber-500 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-amber-600 disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">첫 번째 댓글을 남겨보세요!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm">
                {comment.author.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{comment.author}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <button className="text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-3">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleUpvote(comment.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.upvotes}</span>
                  </button>
                  <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    답글 달기
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
