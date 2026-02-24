import React from 'react';
import {
    Calendar, User, Clock, ArrowRight, Share2,
    Heart, MessageCircle, Tag, TrendingUp
} from 'lucide-react';


const Blogs = () => {
    // Professional Outsourcing/Project Management Blog Data
    const posts = [
        {
            id: 1,
            title: "Evaluating Data Entry Outsourcing: Cost vs Quality for your Business",
            excerpt: "Learn how to strike the perfect balance between cost-efficiency and data accuracy when choosing an outsourcing partner for large-scale data projects.",
            category: "OUTSOURCING",
            author: "Global Projects Team",
            date: "Feb 20, 2026",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
            featured: true
        },
        {
            id: 2,
            title: "The Future of Back-Office Management in 2026",
            excerpt: "Automation and human expertise are joining forces. See how Global Projects is leading the shift in telecommunication support.",
            category: "TECHNOLOGY",
            date: "Feb 18, 2026",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 3,
            title: "Case Study: Reducing KYC Turnaround by 40%",
            excerpt: "How our dedicated chat support team helped a top-tier bank streamline their client verification process across 5 countries.",
            category: "CASE STUDY",
            date: "Feb 15, 2026",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 4,
            title: "Data Security Standards in Remote Operations",
            excerpt: "Essential protocols for maintaining high integrity and confidentiality in outsourced data handling and client records.",
            category: "SECURITY",
            date: "Feb 12, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
        },
    ];

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    return (
        <div className="space-y-12 animate-fade-in text-text-primary pt-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-dark-600/50 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Knowledge Hub</h1>
                    <p className="text-text-muted font-medium text-sm italic">Industry insights, operational updates and strategy guides.</p>
                </div>
                <div className="flex gap-2 mt-6 md:mt-0">
                    {['ALL', 'STRATEGY', 'OPPS', 'TECH', 'SECURITY'].map((cat) => (
                        <button key={cat} className="px-4 py-2 rounded-full bg-dark-800 border border-dark-600 text-[10px] font-black tracking-widest text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Post */}
            <div className="relative group cursor-pointer h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/10">
                <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-40 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-transparent" />

                <div className="absolute bottom-0 left-0 p-10 md:p-14 space-y-6 max-w-4xl z-10">
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                            {featuredPost.category}
                        </span>
                        <div className="flex items-center gap-4 text-text-secondary text-[11px] font-bold">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {featuredPost.date}</span>
                            <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {featuredPost.readTime}</span>
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black leading-tight group-hover:text-primary transition-colors duration-300">
                        {featuredPost.title}
                    </h2>

                    <p className="text-text-secondary text-base md:text-lg line-clamp-2 max-w-2xl font-medium">
                        {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center gap-6 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-black/50">GP</div>
                            <div>
                                <p className="text-xs font-black text-text-primary">{featuredPost.author}</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global Insights Lead</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black text-primary hover:text-text-primary transition-all group/btn uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1">
                            Continue Reading <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Stories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                    <div key={post.id} className="bg-dark-800 rounded-[2rem] overflow-hidden border border-dark-600/50 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full shadow-lg">
                        <div className="relative h-60 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                            <div className="absolute top-6 left-6 bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-primary shadow-2xl">
                                {post.category}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1 space-y-5">
                            <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                                <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</span>
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                            </div>

                            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed font-medium">
                                {post.excerpt}
                            </p>

                            <div className="mt-auto pt-6 border-t border-dark-700/50 flex items-center justify-between text-text-muted">
                                <div className="flex gap-4">
                                    <Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
                                    <MessageCircle className="w-4 h-4 hover:text-text-primary transition-colors" />
                                </div>
                                <Share2 className="w-4 h-4 hover:text-text-primary transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Newsletter Simulation */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-transparent p-12 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp className="w-64 h-64 text-primary" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter mb-2">Get the latest insights.</h3>
                    <p className="text-text-secondary font-medium">Join 500+ managers receiving our weekly industry analysis.</p>
                </div>
                <div className="flex w-full md:w-auto gap-3 relative z-10">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-dark-900/50 border border-dark-600 rounded-xl px-6 py-3.5 text-sm focus:outline-none focus:border-primary flex-1 md:w-80 shadow-inner"
                    />
                    <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Blogs;
