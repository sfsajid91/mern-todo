import Lottie from 'lottie-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import animationData from '../assets/notfound.json';

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>404 Not Found - TODO App</title>
            </Helmet>
            <div className="min-h-screen flex flex-col items-center">
                <Lottie animationData={animationData} />
                <h1 className="md:text-lg font-semibold text-center">
                    The Page You are looking for is Not Found
                </h1>
                <Link to="/" className="btn btn-accent mt-4">
                    Go Home
                </Link>
            </div>
        </>
    );
}
