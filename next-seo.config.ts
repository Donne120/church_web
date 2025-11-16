import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | CYSMF',
  defaultTitle: 'CYSMF - Christian Youth and Students Missionary Fellowship',
  description: 'Empowering young believers on campuses across Rwanda and beyond. Join us in reaching students with the Gospel of Jesus Christ.',
  openGraph: {
    type: 'website',
    locale: 'en_RW',
    url: 'https://cysmf.org',
    siteName: 'CYSMF Rwanda',
    title: 'Christian Youth and Students Missionary Fellowship',
    description: 'Empowering young believers on campuses across Rwanda and beyond.',
    images: [
      {
        url: 'https://cysmf.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CYSMF Rwanda',
      },
    ],
  },
  twitter: {
    handle: '@cysmf',
    site: '@cysmf',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'CYSMF, Christian, Youth, Students, Missionary, Fellowship, Campus Ministry, Rwanda, Kigali, Gospel, Evangelism',
    },
    {
      name: 'author',
      content: 'CYSMF Rwanda',
    },
  ],
};

export default config;

