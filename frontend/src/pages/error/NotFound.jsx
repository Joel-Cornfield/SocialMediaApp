import { IconZoomExclamation } from "@tabler/icons-react";
import "./notFound.scss";

const NotFound = () => {
    return (
        <div>
            <div className="error-404">
                <IconZoomExclamation size={100} />
                <h1>404 Page not found</h1>
                <p>
                This page could not be found..
                </p>
            </div>
        </div>
    );
};

export default NotFound;