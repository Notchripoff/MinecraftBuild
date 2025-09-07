import SubmitForm from './SubmitForm';

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Submit Your Build</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share your masterpiece with the K12 VAVA community!
        </p>
      </div>
      <SubmitForm />
    </div>
  );
}
