import { Grid } from "@mui/material";

import VideoSkeletonCard from './VideoSkeletonCard';

import VideoCard from "./VideoCard";

export default function VideoList({ videos }) {
    return (
        <Grid container spacing={3}>
            {(!videos.length ? [...Array(12)] : videos).map((video, index) =>
                video ? (
                    <Grid key={video.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                        <VideoCard video={video} index={index} />
                    </Grid>
                ) : (
                    <VideoSkeletonCard key={index} />
                )
            )}
        </Grid>
    )
}