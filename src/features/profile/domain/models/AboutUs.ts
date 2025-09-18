export interface AboutUs {
  ourMission: {
    heading: string;
    description: string;
  };
  ourTeam: {
    heading: string;
    description: string;
    members: TeamMember[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  phone: string | null;
  email: string;
  tagline: string;
  description: string;
  profilePic: string;
}