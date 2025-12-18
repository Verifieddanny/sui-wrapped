import { createServerFn } from '@tanstack/react-start';
import { prisma } from '@/lib/prisma';
import { indexUser } from '@/lib/index';

type WrappedData = {
  totalVolumeUSD: number;
  peakDay: string;
  peakDayCount: number;
  topAssetSymbol: string;
  archetype: string;
  rankPercentile: number;
};

type WrappedResponse = {
  status: 'IDLE' | 'INDEXING' | 'COMPLETED' | 'ERROR';
  data?: WrappedData;
};

export const checkWrappedStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((address: string) => address)
  .handler(async ({ data: address }): Promise<WrappedResponse> => {
    try {
      const user = await prisma.user.findUnique({
        where: { address },
        include: { stats: true },
      });

      if (user?.isIndexed && user.stats) {
        return { 
          status: 'COMPLETED', 
          data: user.stats as unknown as WrappedData 
        };
      }

      indexUser(address).catch(console.error);

      return { status: 'INDEXING' };
    } catch (error) {
      console.error(error);
      return { status: 'ERROR' };
    }
  });