import './members-list.scss';

export interface IMember {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

interface IMembersListProps {
    userRole: string
}

export const MembersList = ({ userRole }: IMembersListProps) => {
    
    return (
        <div className='members-list'>
            { userRole }
        </div>
    );
};