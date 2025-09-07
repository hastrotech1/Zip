// import Avatar from '@mui/material/Avatar';
// import Stack from '@mui/material/Stack';
// import { NotificationsNoneOutlined } from '@mui/icons-material';
// // import Notifications from "../notification/notification";
// import { Link } from 'react-router-dom';

// interface ProfileHeaderProps {
// 	content: React.ReactNode;
// 	profilePic?: string;
// }

// const ProfileHeader = (prop: ProfileHeaderProps) => {
// 	return (
// 		<>
// 			<header className='flex justify-between items-center '>
// 				{prop.content}
// 				<div className='flex items-center gap-7'>
// 					<Link to='/notification'>
// 						<NotificationsNoneOutlined className='scale-150 border rounded' />
// 					</Link>

// 					<Stack>
// 						{prop.profilePic ? (
// 							<Avatar alt='profile image' src={prop.profilePic} />
// 						) : null}
// 					</Stack>
// 				</div>
// 			</header>
// 		</>
// 	);
// };

// export default ProfileHeader;

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  content: React.ReactNode;
  profile_image?: string;
}

const ProfileHeader = ({ content, profile_image }: ProfileHeaderProps) => { 
  return (
    <header className="flex justify-between items-center p-4">
      {content}
      <div className="flex items-center gap-6">
        <Link
          to="/notification"
          className="hover:opacity-80 transition-opacity"
        >
          <Bell className="h-6 w-6 border rounded p-1" />
        </Link>

        {profile_image && (
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile_image} alt="Profile picture" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;
