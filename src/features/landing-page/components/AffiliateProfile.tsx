import defaultPhoto from '../assets/images/julia-profile-default.jpeg';

interface AffiliateProfileProps {
  name: string;
  photoUrl?: string;
}

export function AffiliateProfile({ name, photoUrl }: AffiliateProfileProps) {
  return (
    <div className="julia-profile">
      <img className="julia-profile-photo" src={photoUrl || defaultPhoto} alt={name} />
      <h2 className="julia-profile-greeting">Oi, prazer sou a {name}!</h2>
    </div>
  );
}
