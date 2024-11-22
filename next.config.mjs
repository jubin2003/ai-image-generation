/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/pricing',
          destination: '/app/dashboard/_components/PricingPage', // Adjust this to match the actual file location
        },
      ];
    },
  };
  

