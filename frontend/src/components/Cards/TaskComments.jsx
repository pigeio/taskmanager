import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AvatarGroup from "../layouts/AvatarGroup";
import toast from "react-hot-toast";
import moment from "moment";

const TaskComments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.TASKS.GET_COMMENTS(taskId));
            setComments(res.data);
        } catch (err) {
            console.error("Error fetching comments", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            setLoading(true);
            const res = await axiosInstance.post(API_PATHS.TASKS.ADD_COMMENT(taskId), {
                text: newComment,
            });
            setComments([res.data, ...comments]);
            setNewComment("");
            toast.success("Comment added");
        } catch (err) {
            toast.error("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) fetchComments();
    }, [taskId]);

    return (
        <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Comments</h3>

            {/* Input */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
                />
                <button
                    onClick={handleAddComment}
                    disabled={loading || !newComment.trim()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {comments.map((c) => (
                    <div key={c._id} className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="h-10 w-10 flex-shrink-0">
                            {c.userId?.profileImageUrl ? (
                                <img
                                    src={c.userId.profileImageUrl}
                                    alt={c.userId.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                    {c.userId?.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{c.userId?.name}</span>
                                <span className="text-xs text-gray-400">{moment(c.createdAt).fromNow()}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{c.text}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-gray-400 text-center text-sm py-4">No comments yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};

export default TaskComments;
