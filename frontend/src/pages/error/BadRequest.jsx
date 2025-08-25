import { IconZoomExclamation } from "@tabler/icons-react";

const BadRequest = () => {
    return (
        <div>
            <div className="error-404">
                <IconZoomExclamation size={100} />
                <h1>400 Bad Request</h1>
                <p>Oops...Something went wrong.</p>
            </div>
        </div>
    );
};

export default BadRequest;