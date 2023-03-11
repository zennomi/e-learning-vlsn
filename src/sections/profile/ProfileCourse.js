import { useState, useCallback, useEffect } from 'react';
// mui
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';

import useIsMountedRef from '../../hooks/useIsMountedRef';

import CourseCard from '../course/CourseCard';
// utils
import axios from '../../utils/axios';

export default function ProfileCourses() {
    const isMountedRef = useIsMountedRef();
    const [courses, setCourses] = useState([]);
    const getCourses = useCallback(async () => {
        try {
            const { data } = await axios.get('/v1/courses/actived');
            if (isMountedRef.current) {
                setCourses(data.results);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getCourses();
        return () => { setCourses([]); }
    }, [getCourses]);

    return (
        <Grid container spacing={2}>
            {
                courses.map(t =>
                    <Grid item xs={12} md={4} lg={3} key={t.id}>
                        <CourseCard course={t} />
                    </Grid>
                )
            }
        </Grid>
    )
}