import { type SchemaTypeDefinition } from 'sanity'

import {authorType} from './objects/authorType'
import {blockContentType} from './objects/blockContentType'
import {cardButtonSectionType} from './objects/cardButtonSectionType'
import {categoryType} from './objects/categoryType'
import {containerSectionType} from './objects/containerSectionType'
import {ctaSectionType} from './objects/ctaSectionType'
import {footerSettingsType} from './objects/footerSettingsType'
import { graphicDesign } from './objects/graphicDesign'
import {heroSectionType} from './objects/heroSectionType'
import {imageSectionType} from './objects/imageSectionType'
import {navbarSettingsType} from './objects/navbarSettingsType'
import {pageType} from './objects/pageType'
import { pdfAutomation } from './objects/pdfAutomation'
import {postType} from './objects/postType'
import {richTextSectionType} from './objects/richTextSectionType'
import {siteSettingsType} from './objects/siteSettingsType'
import {spacerSectionType} from './objects/spacerSectionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    pageType,
    heroSectionType,
    richTextSectionType,
    ctaSectionType,
    spacerSectionType,
    imageSectionType,
    cardButtonSectionType,
    containerSectionType,
    siteSettingsType,
    navbarSettingsType,
    footerSettingsType,
    pdfAutomation,
    graphicDesign
  ],
}
