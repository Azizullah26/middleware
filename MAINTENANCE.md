# Maintenance Schedule

## Azure Client Secret Renewal

**Current Secret Details:**
- **Expires:** 24/08/2027
- **Secret ID:** 3f74a2a4-4ee1-47e5-abae-87f304106378
- **Description:** door
- **Value:** 4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu

**Renewal Process:**
1. **6 months before expiration (February 2027):** Create new client secret in Azure portal
2. **Update environment variables** in Vercel dashboard
3. **Test integration** with new secret
4. **Remove old secret** after successful deployment

**Critical Dates:**
- ⚠️ **Renewal Due:** February 24, 2027
- 🚨 **Expires:** August 24, 2027

## Monitoring Checklist
- [ ] Monthly: Check Vercel function logs for errors
- [ ] Quarterly: Verify Graph API permissions
- [ ] Bi-annually: Test Dahua device connectivity
- [ ] Annually: Review user/room mappings
