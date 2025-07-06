"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"

export function Footer() {
  const { isRTL } = useLanguage()
  const { t } = useTranslations()

  return (
    <footer className="border-t bg-background my-3">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">DeelDeal</h3>
            <div className="mb-4 flex gap-4">
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("categories")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/electronics"  className="text-muted-foreground hover:text-primary">
                  {t("electronics")}
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="text-muted-foreground hover:text-primary">
                  {t("fashion")}
                </Link>
              </li>
              <li>
                <Link href="/category/home" className="text-muted-foreground hover:text-primary">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/category/beauty" className="text-muted-foreground hover:text-primary">
                  {t("beauty")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("contactUs")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/customerService" className="text-muted-foreground hover:text-primary">
                  {t("customerService")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  {t("aboutUs")}
                </Link>
              </li>
             
              
            </ul>
          </div>

          {/* <div>
            <h3 className="mb-4 text-lg font-semibold">{t("termsOfUse")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  {t("termsOfUse")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground hover:text-primary">
                  {t("warranty")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  {t("returnPolicy")}
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DeelDeal. {t("allRightsReserved")}
            </p>
          
          </div>
        </div>
      </div>
    </footer>
  )
}
