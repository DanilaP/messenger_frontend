import type { IPublication } from "../../../../../../../models/publication/publication-interface";
import "./publication.scss";

interface IPublicationProps {
    publication: IPublication;
}

const Publication = ({ publication }: IPublicationProps) => {
	console.log(publication);
	return (
		<div className="publication">
			<div
				className="image"
				style={ { backgroundImage: `url("${publication.file.url}")` } }
			>
				<div className="image-overlay"></div>
				<div className="image-text">{ publication.text }</div>
			</div>
		</div>
	);
};

export default Publication;