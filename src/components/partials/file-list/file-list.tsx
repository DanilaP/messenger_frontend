import type { IFile } from '../../../interfaces/files';
import { FaFileWord } from "react-icons/fa";
import { AiFillFileText } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";
import { FaFileZipper } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import './file-list.scss';

interface IFileListProps {
    files: IFile[]
}

const FileList = ({ files }: IFileListProps) => {
    
    const returnFileIcon = (fileType: string, url: string) => {
        if (fileType.includes("word")) {
            return <FaFileWord color="var(--default-color)" />;
        }
        if (fileType.includes("text")) {
            return <AiFillFileText />;
        }
        if (fileType.includes("excel") || fileType.includes("xml")) {
            return <FaFileExcel color="green" />;
        }
        if (fileType.includes("zip")) {
            return <FaFileZipper />;
        }
        if (fileType.includes("pdf")) {
            return <FaFilePdf color='red' />;
        }
        if (fileType.includes("image")) {
            return <img className='file-list-image' src = { url } />
        }
    }

    return (
        <div className='file-list'>
            {
                files.map(file => {
                    return (
                        <div key={ file.url } className="file">
                            <div className="icon">
                                { returnFileIcon(file.type, file.url) }
                            </div>
                            <div className="name">{ file.name }</div>
                            <div className="size">{ (file.size / 8 / 1024 / 1024).toFixed(2) } мб</div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default FileList;