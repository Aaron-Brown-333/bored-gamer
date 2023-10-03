// GuestLayout.tsx
import React, { PropsWithChildren, ReactElement, useState } from 'react';

const UnauthenticatedLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <header>
        {/* Header for non-authenticated users */}
      </header>
      <section>
        {children}
      </section>
    </div>
  );
};

export default UnauthenticatedLayout;
