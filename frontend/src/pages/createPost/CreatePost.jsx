import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconAlertOctagon,
  IconBrandGithub,
  IconPaperclip,
  IconX,
} from "@tabler/icons-react";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../../components/loaders/Loader";
import "./createPost.scss";

const CreatePost = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [git, setGit] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentType, setAttachmentType] = useState(null);
    const attachementRef = useRef(null);

    const MAX_FILE_SIZE = 1024 * 1024 * 8; // 8MB

    const onAttachmentChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].size > MAX_FILE_SIZE) {
                toast.warn("File exceeded max size of 8MB");
            } else {
                if (e.target.files[0].type.startsWith("image")) setAttachmentType('image');
                if (e.target.files[0].type.startsWith("video")) setAttachmentType('video');
                setAttachment(URL.createObjectURL(e.target.files[0]));
            }
        }
    };

    const changeGit = (e) => {
        setGit(e.target.value);
    };

    
    const removeAttachment = () => {
        setAttachment(null); // remove preview;
        attachmentRef.current.value = "";
    };
    
      
    const handleChangeText = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("body", e.target.body.value);
        if (attachment) data.append("attachment", e.target.attachment.files[0]);
        if (git) data.append("gitLink", git);
        
        createPostMutation.mutate(data);
    };

    const postFetch = useFetch();

    const createPostMutation = useMutation({
        mutationFn: (variables) => 
            postFetch("/posts", { method: "POST", body: variables }, false),
        onSuccess: () => {
            toast.success("Post created");
            queryClient.invalidateQueries(["feed"]); // refresh feed
            navigate("/p/home");
        },
        onError: (error, variables, context) => {
            toast.error(error.message);
        },
    });

    return (
        <div className="content new-post">
            <div>
                <Form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <TextareaAutosize
                        onChange={handleChangeText}
                        className="textarea"
                        name="body"
                        required
                        maxLength="2000"
                        placeholder="Share a moment.."
                    />
                    {attachment && (
                        <div className="media-container">
                            {attachmentType == "image" && <img src={attachment} alt="Unknown file format" />}
                            {attachmentType == "video" &&
                                <video controls>
                                <source src={attachment} type={attachment.type} />
                                Your browser does not support the video tag.
                                </video>}
                            <IconX onClick={removeAttachment} />
                        </div>
                    )}
                    <div className="form-options">
                        <div className="attachment-container">
                            <label htmlFor="attachment">
                                <IconPaperclip />
                            </label>
                            <input 
                                ref={attachementRef}
                                type="file"
                                id="attachment"
                                onChange={onAttachmentChange}
                                accept=".png, .jpeg, .jpg, .gif, .mp4, .avi, .mov, .wmv, .mkv, .webm"
                            />
                        </div>
                        <IconBrandGithub/>
                        <p>{text.length}/2000</p>
                        <Loader loading={createPostMutation.isPending} />
                        <button disabled={createPostMutation.isPending} type="submit">
                            Post
                        </button>
                    </div>
                    <p className="options-name">Post Repo (Optional):</p>
                    <input
                        onChange={changeGit}
                        type="text"
                        placeholder="E.g. www.github.com/user/project"
                        value={git}
                    />
                </Form>
                <p className="error-box">
                {error ? (
                    <>
                    <IconAlertOctagon size="18px" />
                    {error}
                    </>
                ) : (
                    ""
                )}
                </p>
            </div>
        </div>
    );
};

export default CreatePost;