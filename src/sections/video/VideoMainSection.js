import parse from 'html-react-parser';
// @mui
import { Card, CardContent, } from '@mui/material';
import CustomStyle from '../../components/CustomStyle';
// sections
import VideoPlayer from "../../sections/video/VideoPlayer";

// ----------------------------------------------------------------------

export default function VideoMainSection({ video }) {
    return video ? (<>
        <VideoPlayer url={video.url} />
        {video?.description && (
            <Card>
                <CardContent>
                    <CustomStyle>{parse(video.description)}</CustomStyle>
                </CardContent>
            </Card>
        )}
    </>
    ) : <></>;
}
