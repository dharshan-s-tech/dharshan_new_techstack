import React from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import cagPhoto from '@/app/Assets/Images/cc8a1a5614f48c98f397dcafcf38e8f22843dc2a.png';

export default function CagOfIndiaPage() {
  return (
    <AboutLayout title="CAG of India">
      <div className="cag-profile-card">
        <div className="cag-profile-card__decoration" aria-hidden="true">
          <img src="/assets/e7eaf35651b42d95ab09eb8fb981ccd61f9d01b2.svg" alt="" />
        </div>
        <div className="cag-profile-card__photo">
          <img src={cagPhoto.src} alt="Shri K Sanjay Murthy, Comptroller and Auditor General of India" />
          <div className="cag-profile-card__photo-overlay"></div>
        </div>
        <div className="cag-profile-card__info">
          <h2 className="cag-profile-card__name">Shri K Sanjay Murthy</h2>
          <p className="cag-profile-card__title">Comptroller and Auditor General of India</p>
        </div>
      </div>

      <div className="cag-bio">
        <p><strong>Shri K. Sanjay Murthy</strong> was sworn in as the Comptroller and Auditor General of India on 21st November 2024 by the Hon&rsquo;ble President of India and he assumed office on the same day.</p>
        <p>Before his appointment as CAG, Shri K. Sanjay Murthy, an IAS Officer of 1989 batch, served as the Secretary in the Department of Higher Education, Ministry of Education, a position he held from 1st October, 2021 to 20th November, 2024. In this role, he played a pivotal role in implementation of the transformational National Education Policy 2020.</p>
        <p>Previously, he held the position of Chief Executive Officer and Managing Director of the National Industrial Corridor Development Corporation Limited under the Ministry of Commerce and Industry. He also held senior positions as Additional Secretary and Joint Secretary in the Ministry of Housing and Urban Affairs and Ministry of Information and Broadcasting, overseeing development of urban transport and broadcast regulations and licensing. In the State Government, he worked as Secretary in the Education, Technical Education, Power and Transport sectors. During his service, he has also served in the National Institute of Smart Government (NISG), assisting State and Central Government Ministries/Departments with their e-governance adoption.</p>
        <p>Shri Murthy likes to read, listen to music, capturing moments through photography and spending time with nature in his spare time.</p>
      </div>
    </AboutLayout>
  );
}
