import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import socket from "../socket/socket-client";

export default function CommentList({comments}) {
    
    return (
        <div className="group-comment">
            {
                comments.map((item, index) => (
                    <CommentCard key={index} comment={item} />
                ))
            }
        </div>
    )
}