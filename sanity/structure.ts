import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Navbar')
        .id('navbarSettings')
        .child(
          S.document()
            .schemaType('navbarSettings')
            .documentId('navbarSettings'),
        ),
      S.listItem()
        .title('Footer')
        .id('footerSettings')
        .child(
          S.document()
            .schemaType('footerSettings')
            .documentId('footerSettings'),
        ),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['siteSettings', 'navbarSettings', 'footerSettings', 'page', 'post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
