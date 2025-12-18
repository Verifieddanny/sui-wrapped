import WrappedSlideshow from '@/components/WrappedSlideshow';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/wrapped/$address')({
    component: WrappedPage
})


function WrappedPage() {

    return (
        <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <WrappedSlideshow />
            </div>
        </div>
    );
}

export default WrappedPage