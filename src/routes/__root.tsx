import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Analytics } from "@vercel/analytics/react"
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // --- Primary SEO ---
      {
        title: 'SuiWrap | 2025 Sui On-Chain Wrapped',
      },
      {
        name: 'description',
        content: 'Discover your 2025 on-chain story on Sui. Visualize your transaction history, top assets, and blockchain persona with SuiWrap.',
      },
      {
        name: 'keywords',
        content: 'Sui, Blockchain, Crypto, Wrapped, Year in Review, Analytics, Wallet Tracker, BlockWrap, SuiWrap',
      },
      {
        name: 'author',
        content: 'DevDanny',
      },
      // --- Open Graph / Facebook ---
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://sui-wrapped-five.vercel.app/',
      },
      {
        property: 'og:title',
        content: 'SuiWrap | 2025 Sui On-Chain Wrapped',
      },
      {
        property: 'og:description',
        content: 'Uncover your blockchain persona. See your top assets, biggest moves, and rank among other Sui users.',
      },
      {
        property: 'og:image',
        content: 'https://sui-wrapped-five.vercel.app/og-image.jpg',
      },
      // --- Twitter ---
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:url',
        content: 'https://sui-wrapped-five.vercel.app/',
      },
      {
        name: 'twitter:title',
        content: 'SuiWrap | 2025 Sui On-Chain Wrapped',
      },
      {
        name: 'twitter:description',
        content: 'Uncover your blockchain persona. See your top assets, biggest moves, and rank among other Sui users.',
      },
      {
        name: 'twitter:image',
        content: 'https://sui-wrapped-five.vercel.app/og-image.jpg',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => <div>Page Not Found</div>,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Analytics />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}