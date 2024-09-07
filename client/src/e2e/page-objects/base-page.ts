import { expect, Page } from "@playwright/test";
import { EcoliMockData, EntMockData } from "../fixtures";

interface Load {
  url?: string;
}

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async load({ url }: Load = { url: "http://localhost:5173" }): Promise<void> {
    await this.page.goto(url!);
    await this.page.waitForLoadState("networkidle");
  }

  async expectAboutPageTitle(){
    expect(this.page.getByRole('heading', {name: 'Monitoring biodiversity and water quality in East Essex and Suffolk'})).toBeVisible();
  }

  async expectMapWorks() {
    const enteroccusDatapoint1 = "path.circle-marker-NFP_ENT-Co_2-1492-4";
    const enteroccusDatapoint2 = "path.circle-marker-NFP_ENT-Co_15-0-1";

    const eColiDatapoint1 = "path.circle-marker-NFP_EC-Co_2-1612-4";
    const eColiDatapoint2 = "path.circle-marker-NFP_EC-Co_13-566-4";

    await expect(this.page.locator(enteroccusDatapoint1)).toBeVisible();
    await expect(this.page.locator(enteroccusDatapoint2)).toBeVisible();

    await expect(this.page.locator(eColiDatapoint1)).not.toBeVisible();
    await expect(this.page.locator(eColiDatapoint2)).not.toBeVisible();

    await this.page.getByLabel("Select bacteria").click();
    await this.page.getByText("E. coli").click();

    await expect(this.page.locator(enteroccusDatapoint1)).not.toBeVisible();
    await expect(this.page.locator(enteroccusDatapoint2)).not.toBeVisible();

    await expect(this.page.locator(eColiDatapoint1)).toBeVisible();
    await expect(this.page.locator(eColiDatapoint2)).toBeVisible();
  }

  async expectFundraisingLinkWorks() {
    await this.page
      .getByRole("link", {
        name: "Learn More About the Project & Support Our Cause",
      })
      .click();

    await expect(this.page.url()).toBe("https://click.hubbub.net/p/CRAP2024/");
  }

  async mockMapApiResponse(){
    await this.page.route('https://crap-api-635719a27ef1.herokuapp.com/data?parameter=NFP_ENT', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(EntMockData),
      });
    });
  
    await this.page.route('https://crap-api-635719a27ef1.herokuapp.com/data?parameter=NFP_EC', (route) => {  
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(EcoliMockData),
      });
    });
  }
}
