import { test, expect, type Page } from "@playwright/test";

const permissions = ["catalog.manage","purchases.manage","sales.manage","inventory.manage","accounting.manage"];
async function fixture(page: Page, owner = true) {
  await page.addInitScript(() => {
    localStorage.setItem("auth_session",JSON.stringify({token:"fixture",tenantId:"fixture-tenant",user:{username:"fixture"}}));
    localStorage.setItem("auth_token","fixture");localStorage.setItem("tenant_id","fixture-tenant");
  });
  const posted: { path: string; body: Record<string,unknown> }[] = [];
  const notes: Record<string,unknown>[] = [];
  let staff: Record<string,unknown>[] = [];
  const item = { id:"s1",billNumber:"SALE-1",serialNumber:"SERIAL-1",productName:"Phone",customerName:"Original buyer",customerMobile:"9000000000",customerAddress:"Original address",billDate:"2026-01-02",sellingPrice:1000,discount:0,taxableAmount:1000,cgstRate:9,cgstAmount:90,sgstRate:9,sgstAmount:90,totalAmount:1180,amountPaid:1180,balance:0,paymentStatus:"Paid" };
  await page.route("**/api/**", async route => {
    const request=route.request();const path=new URL(request.url()).pathname.replace(/^.*\/api/,"");
    let data:unknown=[];
    if(request.method()==="POST" || request.method()==="PUT") {
      const body=request.postDataJSON();posted.push({path,body});
      if(path==="/accounting/corrections")notes.push({id:"n1",sourceId:body.sourceId,kind:body.kind,billNumber:"SALE-1",noteNumber:"CN-1",noteDate:body.noteDate,reason:body.reason,disposition:body.disposition,totalAmount:1180,taxableAmount:1000,cgstRate:9,sgstRate:9,cgstAmount:90,sgstAmount:90,refunded:0,refundAvailable:1180});
      if(path.endsWith("/refunds")){notes[0].refunded=body.amount;notes[0].refundAvailable=1180-Number(body.amount);}
      if(path==="/accounting/staff/invitations")staff=[{id:"u1",...body,isOwner:false,isActive:false,emailVerified:false}];
      data={id:"s1"};
    } else if(path==="/accounting/access")data={isOwner:owner,permissions:owner?permissions:[]};
    else if(path==="/accounting/corrections")data=notes;
    else if(path==="/accounting/corrections/n1/refunds")data=notes[0]?.refunded?[{id:"r1",paymentDate:"2026-01-03",amount:notes[0].refunded,paymentMode:"Cash",reference:"REFUND-1"}]:[];
    else if(path==="/accounting/staff")data=staff;
    else if(path==="/accounting-permissions")data=staff.map(s=>({userId:s.id,permissions:[]}));
    else if(path==="/sales/accounting/bills")data={items:[item],page:1,pageSize:100,totalCount:1,totalPages:1};
    else if(path==="/sales/accounting/bills/s1")data={bill:item,payments:[]};
    else if(path==="/products/all")data=[{id:"p1",brand:"Brand",productModel:"Phone",variant:"128GB",color:"Blue",serialNumber:"SERIAL-1",totalAmount:1180,cgst:9,sgst:9}];
    else if(path==="/taxes/all")data=[{id:"t1",cgst:9,sgst:9,totalTax:18}];
    else if(path==="/settings/customer-bill")data={companyName:"Changed shop",paperSize:"A4",billTitle:"SALES INVOICE",showCustomerEmail:true,showSerialNumber:true,showDiscount:true,showPaymentHistory:true,showBalanceDue:true};
    else if(path==="/accounting/snapshots/Sale/s1")data={partyName:"Original buyer",partyMobile:"9000000000",partyAddress:"Original address",productName:"Phone",serialNumber:"SERIAL-1",reconstructed:false,detailsJson:JSON.stringify({seller:{companyName:"Frozen shop",companyAddress:"Original shop address"}})};
    else if(path==="/general-ledger/accounts")data=[{id:"ar",code:"1100",name:"Receivables",type:0}];
    else if(path==="/accounting/opening-customers")data=[{id:"c1",name:"Buyer"}];
    else if(path==="/accounting/reconciliation")data={asOf:"2026-01-01",receivableSubledger:0,receivableLedger:0,receivableDifference:0,payableSubledger:0,payableLedger:0,payableDifference:0,stockSubledger:0,stockLedger:0,stockDifference:0};
    await route.fulfill({status:200,contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify(data)});
  });
  return posted;
}

test("sale selection fills GST-inclusive cost, keeps edited selling price, and submits converted invoice values",async({page})=>{
  const posted=await fixture(page);await page.goto("/sales/products/add");
  await page.getByLabel("Product (name or serial number)").click();await page.getByRole("option",{name:/SERIAL-1/}).click();
  await expect(page.getByLabel("Purchase Price (including GST)")).toHaveValue("1180");
  await expect(page.getByLabel("GST rate")).toHaveValue("CGST 9% + SGST 9%");
  await page.getByLabel("Selling Price (including GST)").fill("1000");
  await page.getByLabel("Customer Name or Mobile").fill("Buyer");await page.getByLabel("Mobile Number").fill("9000000000");await page.getByRole("textbox",{name:"Address",exact:true}).fill("Buyer address");
  await expect(page.getByLabel("Selling Price (including GST)")).toHaveValue("1000");await expect(page.getByLabel("Discount (including GST)")).toHaveValue("180");
  await page.getByRole("button",{name:"Create Sale",exact:true}).click();
  await expect.poll(()=>posted.find(p=>p.path==="/sales/products")).toBeTruthy();
  const payload=posted.find(p=>p.path==="/sales/products")!.body;expect(payload.taxId).toBe("t1");expect(payload.discount).toBe(152.54);expect(payload.sellingPrice).toBe(1000);
});

test("return and refund forms retain the source and send ledger-safe requests",async({page})=>{
  const posted=await fixture(page);await page.goto("/accounting/corrections");
  await expect(page.getByLabel("Invoice unit").locator("option")).toHaveCount(2);
  await page.getByLabel("Invoice unit").selectOption("s1");await page.getByLabel("Reason",{exact:true}).fill("Customer return");
  await page.getByRole("button",{name:"Post credit note"}).click();await expect(page.getByRole("cell",{name:/^CN-1/})).toBeVisible();
  await page.getByRole("button",{name:"Record refund"}).click();await page.getByLabel("Amount",{exact:true}).fill("100");await page.getByRole("button",{name:"Save refund"}).click();
  await expect.poll(()=>posted.some(p=>p.path==="/accounting/corrections/n1/refunds")).toBe(true);
  expect(posted.find(p=>p.path==="/accounting/corrections")!.body).toMatchObject({kind:"Sale",sourceId:"s1",reason:"Customer return",disposition:"Restock"});
  await page.getByRole("button",{name:"View note"}).click();
  const note=page.getByRole("dialog",{name:"Credit or debit note"});
  await expect(note).toContainText("Original buyer");await expect(note).toContainText("CGST reversal (9%)");await expect(note).toContainText("REFUND-1");
  await expect(note.getByRole("button",{name:"Print / save PDF"})).toBeVisible();
});

test("opening import submits matching GL and customer outstanding items",async({page})=>{
  const posted=await fixture(page);await page.goto("/accounting/opening-balances");
  await page.getByLabel("Account 1").selectOption("ar");await page.getByLabel("debit",{exact:true}).fill("200");
  await page.getByRole("button",{name:"Add outstanding item"}).click();await page.getByLabel("Party",{exact:true}).selectOption("c1");await page.getByPlaceholder("Invoice reference").fill("OLD-SALE");await page.getByLabel("Opening amount").fill("200");
  await page.getByRole("button",{name:"Post reconciled opening balances"}).click();await expect.poll(()=>posted.some(p=>p.path==="/general-ledger/opening-balances")).toBe(true);
  expect(posted.find(p=>p.path==="/general-ledger/opening-balances")!.body).toMatchObject({lines:[{accountId:"ar",debit:200,credit:0}],parties:[{kind:"Customer",partyId:"c1",reference:"OLD-SALE",amount:200}],stockProductIds:[]});
});

test("staff invitations show pending verification and do not grant permissions",async({page})=>{
  const posted=await fixture(page);await page.goto("/accounting/staff");await page.getByLabel("Username",{exact:true}).fill("staff");await page.getByLabel("Email",{exact:true}).fill("staff@example.com");await page.getByLabel("Mobile",{exact:true}).fill("9000000001");
  await page.getByRole("button",{name:"Send invitation"}).click();await expect(page.getByText("Invited",{exact:true})).toBeVisible();expect(posted[0].path).toBe("/accounting/staff/invitations");
  await expect(page.getByLabel("sales.manage",{exact:true})).toBeDisabled();
});

test("ungranted staff cannot open sale add and owner navigation is hidden",async({page})=>{
  await fixture(page,false);await page.goto("/sales/products/add");await expect(page.getByRole("alert")).toContainText("sales.manage");
  await expect(page.getByRole("link",{name:"Staff Access"})).toHaveCount(0);
});

test("printed seller details come from the frozen invoice snapshot",async({page})=>{
  await fixture(page);await page.goto("/sales/accounting/print/s1");await expect(page.getByText("Frozen shop",{exact:true})).toBeVisible();await expect(page.getByText("Changed shop",{exact:true})).toHaveCount(0);await expect(page.getByText("Original buyer",{exact:true})).toBeVisible();
});
