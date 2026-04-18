import mongoose from 'mongoose';
declare const Post: mongoose.Model<{
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: "issue" | "poll" | "discussion";
    options: mongoose.Types.DocumentArray<{
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }, {}, {}> & {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }>;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    comments: mongoose.Types.DocumentArray<{
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        text: string;
        user: mongoose.Types.ObjectId;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    sentiment: "" | "positive" | "negative" | "urgent" | "neutral";
    upvotes: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Post;
//# sourceMappingURL=Post.d.ts.map