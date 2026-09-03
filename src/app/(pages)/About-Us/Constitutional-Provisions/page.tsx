import React from 'react';
import AboutLayout from '@/components/layout/AboutLayout';

export default function ConstitutionalProvisionsPage() {
  return (
    <AboutLayout title="Constitutional-Provisions">
      <div className="space-y-8">
        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">Article 148 — Comptroller and Auditor-General of India</h3>
          <ul className="list-disc pl-5 space-y-3 text-zinc-700 text-sm leading-relaxed">
            <li>There shall be a Comptroller and Auditor-General of India who shall be appointed by the President by warrant under his hand and seal and shall only be removed from office in like manner and on like grounds as a Judge of the Supreme Court.</li>
            <li>Every person appointed to be the Comptroller and Auditor-General of India shall, before he enters upon his office, make and subscribe before the President or some person appointed in that behalf by him, an oath or affirmation according to the form set out for the purpose in the Third Schedule.</li>
            <li>The salary and other conditions of service of the Comptroller and Auditor-General shall be such as may be determined by Parliament by law and, until they are so determined, shall be as specified in the Second Schedule: Provided that neither the salary of a Comptroller and Auditor-General nor his rights in respect of leave of absence, pension or age of retirement shall be varied to his disadvantage after his appointment.</li>
            <li>The Comptroller and Auditor-General shall not be eligible for further office either under the Government of India or under the Government of any State after he has ceased to hold his office.</li>
            <li>Subject to the provisions of this Constitution and of any law made by parliament, the conditions of service of persons serving in the Indian Audit and Accounts Department and the administrative powers of the Comptroller and Auditor-General shall be such as may be prescribed by rules made by the President after consultation with the Comptroller and Auditor-General.</li>
            <li>The administrative expenses of the office of the Comptroller and Auditor-General including all salaries, allowances and pensions payable to or in respect of persons serving in that office, shall be charged upon the Consolidated Fund of India.</li>
          </ul>
        </section>

        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">Article 149 — Duties and Powers of the Comptroller and Auditor-General</h3>
          <p className="text-zinc-700 text-sm leading-relaxed">
            The Comptroller and Auditor-General shall perform such duties and exercise such powers in relation to the accounts of the Union and of the States and of any other authority or body as may be prescribed by or under any law made by Parliament and, until provision in that behalf is so made, shall perform such duties and exercise such powers in relation to the accounts of the Union and of the States as were conferred on or exercisable by the Auditor-General of India immediately before the commencement of this Constitution in relation to the accounts of the Dominion of India and of the provinces respectively.
          </p>
        </section>

        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">Article 150 — Form of Accounts of The Union and of The States</h3>
          <p className="text-zinc-700 text-sm leading-relaxed">
            The accounts of the Union and of the States shall be kept in such form as the President may, on the advice of the Comptroller and Auditor-General of India, prescribe.
          </p>
        </section>

        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">Article 151 — Audit Reports</h3>
          <ul className="list-disc pl-5 space-y-3 text-zinc-700 text-sm leading-relaxed">
            <li>The reports of the Comptroller and Auditor-General of India relating to the accounts of the Union shall be submitted to the president, who shall cause them to be laid before each House of Parliament.</li>
            <li>The reports of the Comptroller and Auditor-General of India relating to the accounts of a State shall be submitted to the Governor of the State, who shall cause them to be laid before the Legislature of the State.</li>
          </ul>
        </section>

        <section className="pb-4">
          <h3 className="text-xl font-bold text-[#751639] mb-4">Article 279 — Calculation of "net proceeds", etc.</h3>
          <ol className="list-decimal pl-5 space-y-3 text-zinc-700 text-sm leading-relaxed">
            <li>In the foregoing provisions of this Chapter, &ldquo;net proceeds&rdquo; means in relation to any tax or duty the proceeds thereof reduced by the cost of collection, and for the purposes of those provisions the net proceeds of any tax or duty, or of any part of any tax or duty, in or attributable to any area shall be ascertained and certified by the Comptroller and Auditor-General of India, whose certificate shall be final.</li>
            <li>Subject as aforesaid, and to any other express provision of this Chapter, a law made by Parliament or an order of the President may, in any case where under this Part the proceeds of any duty or tax are, or may be, assigned to any State, provide for the manner in which the proceeds are to be calculated, for the time from or at which and the manner in which any payments are to be made, for the making of adjustments between one financial year and another, and for any other incidental or ancillary matters.</li>
          </ol>
        </section>
      </div>
    </AboutLayout>
  );
}
